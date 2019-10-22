import { Sub } from './sub/sub';

export class Foo {
    public xy(): void {}

    public yz(): Sub {
        return new Sub();
    }
}
